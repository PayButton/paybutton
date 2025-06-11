import camelcase from 'camelcase';
import { PayButton, PayButtonProps, PaymentDialog, PaymentDialogProps, Widget, WidgetProps } from '@paybutton/react';
import { h } from 'preact';
import { render } from 'preact/compat';
import React from 'react'

const RANDOM_SATOSHIS_DEFAULT_VALUE = false

const validateRandomSatoshis = (item:any) => {
  if ( item && !isNaN(Number(item)) ) 
    return Number(item); 
  if ( item && typeof item === 'string' ) 
    return item === 'true' ? true : item === 'false' ? false : undefined;
}

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
      const widgetExists: boolean = document.getElementsByClassName('paybutton-widget').length > 0
      const dialogbuttonExists: boolean = document.getElementsByClassName('dialogbutton').length > 0

      if (createdInJS && javascriptDivExists === null) {
        console.error(`The Paybutton div#${paybuttonDivID} is either misspelled or missing.`)
      } 
      
      if(paybuttonExists) {
        renderButtons(paybuttonExists);
      }
      if(widgetExists) {
        renderWidgets(widgetExists);
      }
      if(dialogbuttonExists) {
        renderDialogButton(dialogbuttonExists)
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
  'onSuccess',
  'onTransaction',
  'onOpen',
  'onClose',
  'randomSatoshis',
  'successText',
  'theme',
  'text',
  'to',
  'opReturn',
  'disablePaymentId',
  'disabled',
  'goalAmount',
  'editable',
  'wsBaseUrl',
  'apiBaseUrl',
  'disableAltpayment',
  'contributionOffset',
  'autoClose',
  'disableSound',
  'transactionText',
  'size'
];

const requiredProps = [
  'to',
];

function renderDialogButton(dialogbuttonExists: boolean): void {
  const content = document.getElementById('content');
  if (dialogbuttonExists && content) {
      Array
      .from(document.getElementsByClassName('dialogbutton'))
      .forEach(el => {
        content.appendChild(el);
      })    
  }
}

function openDialog(props: PaymentDialogProps): void {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const onClose = (success?: boolean, paymentId?: string) => {
    if (props.onClose !== undefined) {
      props.onClose(success, paymentId);
    }
    container.remove();
  };

  if (props.disabled) {
    const buttonElement = document.activeElement;
    if (buttonElement && buttonElement.tagName === 'BUTTON') {
      buttonElement.textContent = 'Unavailable';
    }
    container.remove();
  } else {
    render(<PaymentDialog container={container} onClose={onClose} {...props} />, container);
  }
}

function renderButtons(paybuttonExists: boolean): void {

  if (!paybuttonExists) {
    console.error('The "paybutton" class is either misspelled or missing.')
  } else {
    findAndRender('paybutton', PayButton, allowedProps, requiredProps);
  }
}

function renderWidgets(widgetExists: boolean): void {
  if (!widgetExists) {
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

      props.randomSatoshis = validateRandomSatoshis(props.randomSatoshis) ?? RANDOM_SATOSHIS_DEFAULT_VALUE

      if (attributes.onSuccess) {
        const geval = window.eval;
        props.onSuccess = geval(attributes.onSuccess);
      }

      if (attributes.onTransaction) {
        const geval = window.eval;
        props.onTransaction = geval(attributes.onTransaction);
      }

      if (attributes.onOpen) {
        const geval = window.eval;
        props.onOpen = geval(attributes.onOpen);
      }

      if (attributes.onClose) {
        const geval = window.eval;
        props.onClose = geval(attributes.onClose);
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

      if (attributes.size && className === 'paybutton') {
        const size = attributes.size.toLowerCase();

        const getScale = (): number => {
          switch (size) {
            case 'xs':
            case 'extrasmall':
              return 0.75;
            case 'sm':
            case 'small':
              return 0.85;
            case 'lg':
            case 'large':
              return 1.20;
            case 'xl':
            case 'extralarge':
              return 1.40;
            default:
              return 1;
          }
        };

        const scale = getScale();

        Object.assign(el.style, {
          transform: `scale(${scale})`,
        });

        props.sizeScaleAlreadyApplied = true
      }


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
  openDialog: (props: PaymentDialogProps) => openDialog(props),
  renderButtons,
  renderWidgets,
  renderDialogButton,
};
