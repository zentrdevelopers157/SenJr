import { ProductDetailClient } from '@/components/dom/ProductDetailClient';

const PRODUCTS = [
    { id: '0' },
    { id: '1' },
    { id: '2' },
];

export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        id: product.id,
    }));
}

export default function ProductDetailPage() {
    return <ProductDetailClient />;
}
