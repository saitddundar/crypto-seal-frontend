const API_BASE = "http://localhost:8082";

export interface SealRecord {
    id: string;
    hash: string;
    timestamp: string;
    text?: string;
}

export interface SealResponse {
    id: string;
    hash: string;
    timestamp: string;
    message: string;
}

export interface VerifyResponse {
    valid: boolean;
    message: string;
    record?: SealRecord;
}

export interface ResolveResponse {
    found: boolean;
    message: string;
    record?: SealRecord;
}

export interface ListResponse {
    count: number;
    records: SealRecord[];
}

// Belge mühürle
export async function sealDocument(text: string): Promise<SealResponse> {
    const res = await fetch(`${API_BASE}/seal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    return res.json();
}

// Metin ile doğrula
export async function verifyDocument(text: string): Promise<VerifyResponse> {
    const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    return res.json();
}

// Hash ile bul
export async function resolveByHash(hash: string): Promise<ResolveResponse> {
    const res = await fetch(`${API_BASE}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash }),
    });
    return res.json();
}

// Tüm seal'ları listele
export async function listSeals(): Promise<ListResponse> {
    const res = await fetch(`${API_BASE}/list`);
    return res.json();
}
