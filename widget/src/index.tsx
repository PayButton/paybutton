import camelcase from 'camelcase';
import { PayButton, PayButtonProps, Widget, WidgetProps } from 'paybutton';
import { h } from 'preact';
import { render } from 'preact/compat';

document.addEventListener( 'DOMContentLoaded', renderButtons );
document.addEventListener( 'DOMContentLoaded', renderWidgets );

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
];

const requiredProps = [
  'to',
];

function renderButtons ( ): void {
  Array
    .from( document.getElementsByClassName( 'paybutton' ) )
    .forEach( el => {

      const attributes = el.getAttributeNames( )
        .reduce( 
          (attributes: Record<string,string>, name: string) => {
            const prop = camelcase( name );
            if ( allowedProps.includes( prop ) ) 
              attributes[ prop ] = el.getAttribute( name )!;
            return attributes;
          }, { } 
        )
      ;

      const props: PayButtonProps = Object.assign( { }, attributes, { to: attributes.to } );

      if ( attributes.amount != null )
        props.amount = +attributes.amount;

      props.hideToasts = attributes.hideToasts === 'true';
      props.randomSatoshis = attributes.randomSatoshis === 'true';

      if ( attributes.onSuccess ) {
        const geval = window.eval;
        props.onSuccess = geval( attributes.onSuccess );
      }

      if ( attributes.onTransaction ) {
        const geval = window.eval;
        props.onTransaction = geval( attributes.onTransaction );
      }

      if ( attributes.theme ) {
        try { 
          props.theme = JSON.parse( attributes.theme )
        } catch {
          // Keep the original string assignment
        }
      }
      
      if ( ! requiredProps.every( name => name in attributes ) ) {
        console.error( 'PayButton: missing required attribute: ' + JSON.stringify( requiredProps.filter( name => ! ( name in attributes ) ) ) );
        return;
      }

      render( <PayButton { ...props } />, el )
    } )
  ;
}

function renderWidgets ( ): void {
  Array
    .from( document.getElementsByClassName( 'paybutton-widget' ) )
    .forEach( el => {

      const attributes = el.getAttributeNames( )
        .reduce( 
          (attributes: Record<string,string>, name: string) => {
            const prop = camelcase( name );
            if ( allowedProps.includes( prop ) ) 
              attributes[ prop ] = el.getAttribute( name )!;
            return attributes;
          }, { } 
        )
      ;

      const props: WidgetProps = Object.assign( { }, attributes, { to: attributes.to } );

      if ( attributes.amount != null )
        props.amount = +attributes.amount;

      props.hideToasts = attributes.hideToasts === 'true';
      props.randomSatoshis = attributes.randomSatoshis === 'true';

      if ( attributes.onSuccess ) {
        const geval = window.eval;
        props.onSuccess = geval( attributes.onSuccess );
      }

      if ( attributes.onTransaction ) {
        const geval = window.eval;
        props.onTransaction = geval( attributes.onTransaction );
      }

      if ( attributes.theme ) {
        try { 
          props.theme = JSON.parse( attributes.theme )
        } catch {
          // Keep the original string assignment
        }
      }
      
      if ( ! requiredProps.every( name => name in attributes ) ) {
        console.error( 'PayButton: missing required attribute: ' + JSON.stringify( requiredProps.filter( name => ! ( name in attributes ) ) ) );
        return;
      }

      render( <Widget { ...props } />, el )
    } )
  ;
}

export default {
  renderButtons,
  renderWidgets,
};

declare global {
  interface Window { PayButton: any; }
}

window.PayButton = {
  render: ( el: HTMLElement, props: PayButtonProps ) => {
    render( <PayButton { ...props } />, el )
  },
  //renderWidget:
  //openDialog:
}