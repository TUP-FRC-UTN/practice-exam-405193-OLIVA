export interface Product {
    id: number,
    name: string,
    price: number,
    stock: number
}

export interface Order {
    customerName: string,
    email: string,
    products: Product[],
    total: number,
    orderCode: string,
    timestamp: string
}
