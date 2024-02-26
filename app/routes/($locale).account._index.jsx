import {redirect} from '@shopify/remix-oxygen'

export async function loader() {
  return redirect('/account/orders');
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

/*import { LoaderReturnData } from "@azure/msal-browser";

export async function loader() {
  return LoaderReturnData ('/account/orders');}*/