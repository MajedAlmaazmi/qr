import { createDirectus } from '@directus/sdk';
import { rest } from '@directus/sdk/rest';

const directus = createDirectus('https://sia.gov.ae/directus').with(rest());

export default directus;