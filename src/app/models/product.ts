export interface Product {
    id: number,
    name: string,
    price: number,
    stock: number
}

export interface Order {
    id?: number
    customerName: string,
    email: string,
    products: Product[],
    total: number,
    orderCode: string,
    timestamp: string
}
