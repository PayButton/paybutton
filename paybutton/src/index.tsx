import camelcase from 'camelcase';
import { PayButton, PayButtonProps, Widget, WidgetProps } from 'paybutton';
import { h } from 'preact';
import { render } from 'preact/compat';

declare global {
  interface Window {
    WebKitMutationObserver: any;
  }
}

if (typeof window !== 'undefined') {
  init();
}

function init() {
  function render() {
    //prevent firing multiple times
    window.onload = () => {
      const paybuttonExists: boolean = document.getElementsByClassName('paybutton').length > 0
      const widgetExists: boolean = document.getElementsByClassName('paybutton-widget').length > 0
      renderButtons(widgetExists, paybuttonExists);
      renderWidgets(widgetExists, paybuttonExists);
    }
  }

  document.addEventListener('DOMContentLoaded', render);

  const MutationObserver = window.MutationObserver ?? window.WebKitMutationObserver;
  const observer = new MutationObserver(render);
  observer.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
  });
}

const allowedProps = [
  'amount',
  'animation',
  'currency',
  'displayCurrency',
  'hideToasts',
  'hoverText',
  'onSuccess',
  'onTransaction',
  'randomSatoshis',
  'successText',
  'theme',
  'text',
  'to',
  'disabled',
  'goalAmount'
];

const requiredProps = [
  'to',
];


export function renderButtons(widgetExists: boolean, paybuttonExists: boolean): void {

  if (!widgetExists && !paybuttonExists) {
    console.error('The Paybutton class is either misspelled or missing.')
  } else {
    findAndRender('paybutton', PayButton, allowedProps, requiredProps);
  }
}

export function renderWidgets(widgetExists: boolean, paybuttonExists: boolean): void {
  if (!widgetExists && !paybuttonExists) {
    console.error('The Paybutton-Widget class is either misspelled or missing.')
  } else {
    findAndRender('paybutton-widget', Widget, allowedProps, requiredProps);
  }
}

function findAndRender<T>(className: string, Component: React.ComponentType<any>, allowedProps: string[], requiredProps: string[]) {
  Array
    .from(document.getElementsByClassName(className))
    .forEach(el => {

      const attributes = el.getAttributeNames()
        .reduce(
          (attributes: Record<string, string>, name: string) => {
            const prop = camelcase(name);
            if (allowedProps.includes(prop))
              attributes[prop] = el.getAttribute(name)!;
            return attributes;
          }, {}
        )
        ;

      const props: Record<string, any> = Object.assign({}, attributes, { to: attributes.to });

      if (attributes.amount != null)
        props.amount = +attributes.amount;

      props.hideToasts = attributes.hideToasts === 'true';
      props.randomSatoshis = attributes.randomSatoshis === 'true';

      if (attributes.onSuccess) {
        const geval = window.eval;
        props.onSuccess = () => geval(attributes.onSuccess);
      }

      if (attributes.onTransaction) {
        const geval = window.eval;
        props.onTransaction = () => geval(attributes.onTransaction);
      }

      if (attributes.theme) {
        try {
          props.theme = JSON.parse(attributes.theme)
        } catch {
          // Keep the original string assignment
        }
      }

      if (!requiredProps.every(name => name in attributes)) {
        /*         console.error('PayButton: missing required attribute: ' + JSON.stringify(requiredProps.filter(name => !(name in attributes)))); */
        // return;
        console.error('The "to" parameter is missing from your PayButton config. Please check it')
      }

      //    el.classList.remove(className);

      render(<Component {...props} />, el)
    });
}

export default {
  render: (el: HTMLElement, props: PayButtonProps) => {
    render(<PayButton {...props} />, el)
  },
  renderWidget: (el: HTMLElement, props: WidgetProps) => {
    render(<Widget {...props} />, el)
  },
};
