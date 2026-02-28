import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type OrderItem = {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    lineTotal: number;
};

type Order = {
    id: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async() => {
        setLoading(true);
    }
}