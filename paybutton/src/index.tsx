import camelcase from 'camelcase';
import { PayButton, PayButtonProps, PaymentDialog, PaymentDialogProps, Widget, WidgetProps } from 'paybutton';
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
    let paybuttonDivID: string = '';
    let createdInJS: boolean = false;
    //prevent firing multiple times
    window.onload = () => {
      const yes = document.scripts;

      for (let i = 0; i < yes.length; i++) {
        const each = yes[i].innerHTML;
        let split = each.split('PayButton.render(document.getElementById(')
        if (split.length > 1) {
          let id: any = split[1].split(`'`)
          createdInJS = true;
          paybuttonDivID = id[1]
        }
      }

      const javascriptDivExists = document.getElementById(paybuttonDivID);
      const paybuttonExists: boolean = document.getElementsByClassName('paybutton').length > 0

      if (createdInJS && javascriptDivExists === null) {
        console.error(`The Paybutton div#${paybuttonDivID} is either misspelled or missing.`)
      } 
      
      if(paybuttonExists) {
        const widgetExists: boolean = document.getElementsByClassName('paybutton-widget').length > 0
        const dialogbuttonExists: boolean = document.getElementsByClassName('dialogbutton').length > 0
        renderDialogButton(dialogbuttonExists)
        renderButtons(widgetExists, paybuttonExists);
        renderWidgets(widgetExists, paybuttonExists);
      }
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
  'onClose',
  'onSuccess',
  'onTransaction',
  'randomSatoshis',
  'successText',
  'theme',
  'text',
  'to',
  'disabled',
  'goalAmount',
  'editable'
];

const requiredProps = [
  'to',
];

export function renderDialogButton(dialogbuttonExists: boolean): void {
  const content = document.getElementById('content');
  if (dialogbuttonExists && content) {
      Array
      .from(document.getElementsByClassName('dialogbutton'))
      .forEach(el => {
        content.appendChild(el);
      })    
  }
}

export function openDialog(props: PaymentDialogProps): void {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(<PaymentDialog container={container} onClose={() => container.remove()} {...props} />, container)
}

export function renderButtons(widgetExists: boolean, paybuttonExists: boolean): void {

  if (!widgetExists && !paybuttonExists) {
    console.error('The "paybutton" class is either misspelled or missing.')
  } else {
    findAndRender('paybutton', PayButton, allowedProps, requiredProps);
  }
}

export function renderWidgets(widgetExists: boolean, paybuttonExists: boolean): void {
  if (!widgetExists && !paybuttonExists) {
    console.error('The "paybutton-widget" class is either misspelled or missing.')
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

      if (attributes.amount != null) {
        props.amount = +attributes.amount;
        if (isNaN(props.amount)) {
          console.error('Amount must be a number')
        }
      }

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

const validateJSProps = (props: PayButtonProps) => {
  if (props.amount !== null && props.amount !== undefined) {
    props.amount = +props.amount

    if (isNaN(props.amount)) {
      console.error('Amount must be a number')
    }
  }

  // validate the rest of the props
}

export default {
  render: (el: HTMLElement, props: PayButtonProps) => {
    if (el !== null) {
      validateJSProps(props)
      render(<PayButton {...props} />, el)
    }
  },
  renderWidget: (el: HTMLElement, props: WidgetProps) => {
    if (el !== null) {
      validateJSProps(props)
      render(<Widget {...props} />, el)
    }
  },
  openDialog: (props: PaymentDialogProps) => openDialog(props)
};