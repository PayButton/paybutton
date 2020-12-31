## Advanced Usage

<p>
  <div class="example-button-1"></div>
</p>
<p>
  <div class="example-button-2"></div>
</p>

<script>

function render( selector, config ) {
  const buttons = document.querySelectorAll( selector )
  for ( const button of buttons )
    PayButton.render( button, config )
}


// render button 1
render( '.example-button-1', {
  text: 'Donate',
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  theme: {
    palette: {
      primary: '#42b983',
      secondary: '#ffffff',
      tertiary: '#333333'
    }
  }
})

// render button 2
render( '.example-button-2', {
  text: 'Purchase',
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  theme: {
    palette: {
      primary: '#b94283',
      secondary: '#ffffff',
      tertiary: '#333333'
    }
  }
})

</script>
