const { default: WooCommerceRestApi } = require("@woocommerce/woocommerce-rest-api");
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const wooUrl = env.match(/NEXT_PUBLIC_WOOCOMMERCE_URL=(.*)/)[1].trim();
    const wooKey = env.match(/WOOCOMMERCE_KEY=(.*)/)[1].trim();
    const wooSecret = env.match(/WOOCOMMERCE_SECRET=(.*)/)[1].trim();
    const msApiKey = env.match(/MASTERSHOP_API_KEY=(.*)/)[1].trim();

    const api = new WooCommerceRestApi({
        url: wooUrl,
        consumerKey: wooKey,
        consumerSecret: wooSecret,
        version: "wc/v3"
    });

    console.log("Obteniendo productos de WooCommerce...");
    const response = await api.get("products", { per_page: 100 });
    const products = response.data;

    console.log(`Se encontraron ${products.length} productos. Sincronizando IDs de MasterShop...`);

    for (const product of products) {
        if (product.sku && product.sku !== "") {
            console.log(`[-] Producto "${product.name}" ya tiene SKU: ${product.sku}. Saltando...`);
            continue;
        }

        console.log(`[*] Buscando "${product.name}" en MasterShop...`);
        try {
            const searchName = encodeURIComponent(product.name.trim());
            const msSearchRes = await fetch(`https://prod.api.mastershop.com/api/products?search=${searchName}`, {
                headers: { "ms-api-key": msApiKey }
            });

            if (msSearchRes.ok) {
                const msData = await msSearchRes.json();
                const foundProducts = msData.results || [];

                const msProduct = foundProducts.find((p) => 
                    p.name.toLowerCase() === product.name.toLowerCase() || 
                    product.name.toLowerCase().includes(p.name.toLowerCase())
                );

                if (msProduct) {
                    const idProduct = msProduct.idProduct;
                    console.log(`    -> ¡Encontrado! ID MasterShop: ${idProduct}. Actualizando WooCommerce...`);
                    
                    await api.put(`products/${product.id}`, {
                        sku: String(idProduct)
                    });
                    console.log(`    -> Actualizado correctamente.`);
                } else {
                    console.log(`    -> No se encontró coincidencia exacta en MasterShop.`);
                }
            } else {
                console.log(`    -> Error en la API de MasterShop: ${msSearchRes.status}`);
            }
        } catch (e) {
            console.error(`    -> Error durante la sincronización:`, e.message);
        }
    }
    console.log("¡Sincronización terminada!");
}

main();
