import {redirect} from '@shopify/remix-oxygen';

// fallback wild card for all unauthenticated routes in account section
/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();

  return redirect('/account', {
    headers: {
      'Set-Cookie': await context.session.commit(),
    },
  });
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: '29dd8d74-eca8-419d-b221-9756616c9fda',
    authority: 'https://login.microsoft.com/cc702a4a-fdc0-4c82-970f-5699766cee82'
  }
};

const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();
