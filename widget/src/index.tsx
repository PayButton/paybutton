import camelcase from 'camelcase';
import PayButton from 'paybutton';
import { PayButtonProps } from 'paybutton/dist/components';
import { h } from 'preact';
import { render } from 'preact/compat';

document.addEventListener( 'DOMContentLoaded', renderButtons );

const allowedProps = [
  'amount',
  'animation',
  'currency',
  'detectPayment',
  'displayCurrency',
  'hideToasts',
  'hoverText',
  'onSuccess',
  'onTransaction',
  'theme',
  'successText',
  'text',
  'to',
];

const requiredProps = [
  'to',
];

function renderButtons ( ): void {
  Array
    .from( document.getElementsByClassName( 'paybutton' ) )
    .forEach( button => {

      const attributes = button.getAttributeNames( )
        .reduce( 
          (attributes: Record<string,string>, name: string) => {
            const prop = camelcase( name );
            if ( allowedProps.includes( prop ) ) 
              attributes[ prop ] = button.getAttribute( name )!;
            return attributes;
          }, { } 
        )
      ;

      const props: PayButtonProps = Object.assign( { }, attributes, { to: attributes.to } );

      if ( attributes.amount != null )
        props.amount = +attributes.amount;

      props.hideToasts = attributes.hideToasts === 'true';
      props.detectPayment = attributes.detectPayment === 'true';

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

      render( <PayButton { ...props } />, button )
    } )
  ;
}

export default {
  renderButtons,
};