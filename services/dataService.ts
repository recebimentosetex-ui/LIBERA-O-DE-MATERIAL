import { supabase } from './supabaseClient';
import { Release, FiberStockItem } from '../types';

// Utilitário para gerar ID de exibição (ex: 10.1, 10.2)
const generateDisplayId = async (table: 'releases' | 'fiber_stock', dateString: string): Promise<string> => {
    const date = new Date(dateString); // Supõe string YYYY-MM-DD ou ISO
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    // Buscar itens deste mês e ano
    const startDate = new Date(currentYear, currentMonth - 1, 1).toISOString();
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59).toISOString();

    const { data, error } = await supabase
        .from(table)
        .select('display_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (error) {
        console.error('Erro ao gerar ID:', error);
        return `${currentMonth}.1`;
    }

    let maxSequence = 0;
    data?.forEach(item => {
        if (item.display_id) {
            const parts = item.display_id.split('.');
            if (parts.length === 2) {
                const seq = parseInt(parts[1], 10);
                if (!isNaN(seq)) maxSequence = Math.max(maxSequence, seq);
            }
        }
    });

    return `${currentMonth}.${maxSequence + 1}`;
};

export const dataService = {
    // --- ADMIN LISTS ---
    getAdminLists: async () => {
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'admin_lists')
            .single();
        
        if (error) throw error;
        return data.value;
    },

    saveAdminLists: async (lists: any) => {
        const { error } = await supabase
            .from('app_settings')
            .upsert({ key: 'admin_lists', value: lists });
        
        if (error) throw error;
        return lists;
    },

    // --- RELEASES ---
    getReleases: async () => {
        const { data, error } = await supabase
            .from('releases')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        // Normalizar dados do banco (snake_case) para a interface (camelCase) se necessário,
        // mas aqui estamos usando mapeamento direto onde os nomes batem ou adaptando no front.
        // O Supabase retorna snake_case por padrão se as colunas forem snake_case.
        // Vamos adaptar os nomes das colunas na query ou mapear no retorno.
        // Dado o schema SQL criado, as colunas são: local_de_entrega. O type espera localDeEntrega.
        
        return data.map((r: any) => ({
            ...r,
            localDeEntrega: r.local_de_entrega,
            displayId: r.display_id
        }));
    },

    saveRelease: async (release: any) => {
        let payload = {
            material: release.material,
            operador: release.operador,
            rua: release.rua,
            local_de_entrega: release.localDeEntrega, // Map camelCase to snake_case column
            data: release.data,
            status: release.status,
            sm: release.sm
        };

        if (release.id) {
            // Update
            const { data, error } = await supabase
                .from('releases')
                .update(payload)
                .eq('id', release.id)
                .select()
                .single();
            if (error) throw error;
            return { ...data, localDeEntrega: data.local_de_entrega, displayId: data.display_id };
        } else {
            // Insert
            const displayId = await generateDisplayId('releases', release.data || new Date().toISOString());
            const { data, error } = await supabase
                .from('releases')
                .insert({ ...payload, display_id: displayId })
                .select()
                .single();
            if (error) throw error;
            return { ...data, localDeEntrega: data.local_de_entrega, displayId: data.display_id };
        }
    },

    deleteRelease: async (id: number) => {
        const { error } = await supabase.from('releases').delete().eq('id', id);
        if (error) throw error;
    },

    // --- FIBER STOCK ---
    getFiberStock: async () => {
        const { data, error } = await supabase
            .from('fiber_stock')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data.map((d: any) => ({ ...d, displayId: d.display_id }));
    },

    saveFiberStock: async (item: any) => {
        let payload = {
            material: item.material,
            lote: item.lote,
            qtd: item.qtd,
            prateleira: item.prateleira,
            rua: item.rua,
            sala: item.sala,
            status: item.status,
            sm: item.sm
        };

        if (item.id) {
            const { data, error } = await supabase
                .from('fiber_stock')
                .update(payload)
                .eq('id', item.id)
                .select()
                .single();
            if (error) throw error;
            return { ...data, displayId: data.display_id };
        } else {
            const displayId = await generateDisplayId('fiber_stock', new Date().toISOString());
            const { data, error } = await supabase
                .from('fiber_stock')
                .insert({ ...payload, display_id: displayId })
                .select()
                .single();
            if (error) throw error;
            return { ...data, displayId: data.display_id };
        }
    },

    deleteFiberStock: async (id: number) => {
        const { error } = await supabase.from('fiber_stock').delete().eq('id', id);
        if (error) throw error;
    },

    importFiberStock: async (items: any[]) => {
        // Para importação em massa, geramos IDs sequenciais
        // Nota: Isso pode não ser atômico perfeito com muitos usuários simultâneos, mas serve para o caso.
        const baseDisplayId = await generateDisplayId('fiber_stock', new Date().toISOString());
        const [month, seqStart] = baseDisplayId.split('.').map(Number);
        
        const rowsToInsert = items.map((item, index) => ({
            material: item.material,
            lote: item.lote,
            qtd: item.qtd,
            prateleira: item.prateleira,
            rua: item.rua,
            sala: item.sala,
            status: item.status,
            sm: item.sm,
            display_id: `${month}.${seqStart + index}`
        }));

        const { data, error } = await supabase
            .from('fiber_stock')
            .insert(rowsToInsert)
            .select();
        
        if (error) throw error;
        return data.map((d: any) => ({ ...d, displayId: d.display_id }));
    }
};
