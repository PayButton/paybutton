const plugin = (hook, vm) => {
  var trans = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 800);
  };
  var setColor = ({
    background,
    toggleBtnBg,
    textColor,
    codeBackground,
    codeFontColor,
  }) => {
    document.documentElement.style.setProperty(
      '--docsify_dark_mode_bg',
      background
    );
    document.documentElement.style.setProperty(
      '--docsify_dark_mode_btn',
      toggleBtnBg
    );
    document.documentElement.style.setProperty(
      '--docsify_dark_mode_code',
      codeBackground
    );
    document.documentElement.style.setProperty(
      '--docsify_dark_mode_code_color',
      codeFontColor
    );
    document.documentElement.style.setProperty('--text_color', textColor);
  };

  var theme = { dark: {}, light: {} };
  var defaultConfig = {
    dark: {
      background: '#1c2022',
      toggleBtnBg: '#97b1cb',
      textColor: '#b4b4b4',
      codeBackground: '#393e46',
      codeFontColor: '#eeeeee',
    },
    light: {
      background: 'white',
      toggleBtnBg: 'var(--theme-color)',
      textColor: 'var(--theme-color)',
      codeBackground: '#f8f8f8',
    },
  };

  theme = { ...defaultConfig, ...vm.config.darkMode };

  hook.afterEach(function (html, next) {
    var darkEl = ` <div id="dark_mode">
             <input class="container_toggle" type="checkbox" id="switch" name="mode" />
             <label for="switch">Toggle</label>
           </div>`;
    html = `${darkEl}${html}`;
    next(html);
  });

  hook.doneEach(function () {
    var currColor;
    if (localStorage.getItem('DOCSIFY_DARK_MODE')) {
      currColor = localStorage.getItem('DOCSIFY_DARK_MODE');
      setColor(theme[`${currColor}`]);
    } else {
      currColor = 'light';
      setColor(theme.light);
    }

    var checkbox = document.querySelector('input[name=mode]');

    if (!checkbox) {
      return;
    }

    checkbox.addEventListener('change', function () {
      // dark
      if (currColor === 'light') {
        trans();
        setColor(theme.dark);
        localStorage.setItem('DOCSIFY_DARK_MODE', 'dark');
        currColor = 'dark';
      } else {
        trans();
        setColor(theme.light);
        localStorage.setItem('DOCSIFY_DARK_MODE', 'light');
        currColor = 'light';
      }
    });
  });
};

window.$docsify.plugins = [].concat(plugin, window.$docsify.plugins);
