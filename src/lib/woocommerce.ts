import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "",
  consumerKey: process.env.WOOCOMMERCE_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_SECRET || "",
  version: "wc/v3"
});
