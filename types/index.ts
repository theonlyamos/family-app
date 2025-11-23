export interface Member {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
    role: "admin" | "member" | "child"
    avatar_url?: string
    created_at: string
}

export interface Event {
    id: string
    title: string
    description?: string
    start_time: string
    end_time: string
    location?: string
    created_by: string
}

export interface Investment {
    id: string
    name: string
    type: "stock" | "crypto" | "real_estate" | "other"
    amount: number
    date: string
    notes?: string
}
