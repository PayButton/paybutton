import { jss } from 'react-jss';

import * as Components from './components';

if (process.env.NODE_ENV === 'production') jss.setup({ id: { minify: true } });

const PayButton = Components.PayButton;
const Widget = Components.Widget;

export default Object.assign(PayButton, { Widget });
