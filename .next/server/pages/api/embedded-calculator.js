"use strict";(()=>{var e={};e.id=596,e.ids=[596],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},4964:(e,t,r)=>{r.r(t),r.d(t,{config:()=>u,default:()=>d,routeModule:()=>i});var a={};r.r(a),r.d(a,{default:()=>c});var n=r(1802),o=r(7153),l=r(6249);function c(e,t){if(t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","GET, OPTIONS"),t.setHeader("Access-Control-Allow-Headers","Content-Type"),"OPTIONS"===e.method){t.status(200).end();return}let r=`
    (function() {
      // Add CSS to the page
      var style = document.createElement('style');
      style.textContent = \`
        .embedded-calculator {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .embedded-calculator h2 { color: #58846a; font-size: 24px; margin-bottom: 20px; }
        .embedded-calculator label { display: block; margin-bottom: 5px; color: #555; }
        .embedded-calculator input, .embedded-calculator select {
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .embedded-calculator button {
          background-color: #58846a;
          color: #fff;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .embedded-calculator button:hover { background-color: #466c54; }
        .embedded-calculator .result {
          margin-top: 20px;
          padding: 15px;
          background-color: #e9ecef;
          border-radius: 4px;
        }
        .embedded-calculator .error { color: #dc3545; margin-top: 10px; }
      \`;
      document.head.appendChild(style);

      // Load React and ReactDOM
      Promise.all([
        loadScript('https://unpkg.com/react@17/umd/react.production.min.js'),
        loadScript('https://unpkg.com/react-dom@17/umd/react-dom.production.min.js')
      ]).then(() => {
        // Tariff Calculator Component
        function TariffCalculator() {
          const [formData, setFormData] = React.useState({
            htsCode: '',
            country: '',
            dutyRate: '',
            numPOs: '',
            numUnits: '',
            unitCost: '',
          });
          const [result, setResult] = React.useState(null);
          const [error, setError] = React.useState('');
          const [loading, setLoading] = React.useState(false);

          const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
          };

          const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setResult(null);
            setLoading(true);

            try {
              const response = await fetch('https://v0-tariff-calculator-lp-gunzcykylch.vercel.app/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
              });

              if (!response.ok) {
                throw new Error('Failed to calculate duty rate');
              }

              const data = await response.json();
              setResult(data);
            } catch (err) {
              console.error('Error in API call:', err);
              setError('An error occurred. Please try again.');
            } finally {
              setLoading(false);
            }
          };

          return React.createElement(
            'div',
            { className: 'embedded-calculator' },
            React.createElement('h2', null, 'Tariff Calculator'),
            React.createElement(
              'form',
              { onSubmit: handleSubmit },
              React.createElement(
                'div',
                null,
                React.createElement('label', { htmlFor: 'htsCode' }, 'HTS Code:'),
                React.createElement('input', {
                  type: 'text',
                  id: 'htsCode',
                  name: 'htsCode',
                  value: formData.htsCode,
                  onChange: handleChange,
                  required: true,
                  placeholder: 'Enter HTS Code'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { htmlFor: 'country' }, 'Country of Origin:'),
                React.createElement('input', {
                  type: 'text',
                  id: 'country',
                  name: 'country',
                  value: formData.country,
                  onChange: handleChange,
                  required: true,
                  placeholder: 'Select country'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { htmlFor: 'numPOs' }, 'Number of PO\\'s (per Year):'),
                React.createElement('input', {
                  type: 'number',
                  id: 'numPOs',
                  name: 'numPOs',
                  value: formData.numPOs,
                  onChange: handleChange,
                  required: true,
                  placeholder: 'Enter number of PO\\'s'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { htmlFor: 'numUnits' }, 'Number of Units (per PO):'),
                React.createElement('input', {
                  type: 'number',
                  id: 'numUnits',
                  name: 'numUnits',
                  value: formData.numUnits,
                  onChange: handleChange,
                  required: true,
                  placeholder: 'Enter number of units'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { htmlFor: 'unitCost' }, 'Unit Cost (per PO) (USD):'),
                React.createElement('input', {
                  type: 'number',
                  id: 'unitCost',
                  name: 'unitCost',
                  value: formData.unitCost,
                  onChange: handleChange,
                  required: true,
                  step: '0.01',
                  placeholder: 'Enter unit cost'
                })
              ),
              React.createElement('button', { type: 'submit', disabled: loading }, loading ? 'Calculating...' : 'Calculate')
            ),
            result && React.createElement(
              'div',
              { className: 'result' },
              React.createElement('p', null, \`Duty Rate: \${result.dutyRate}\`),
              React.createElement('p', null, \`Estimated Duty: $\${result.estimatedDuty}\`)
            ),
            error && React.createElement('div', { className: 'error' }, error)
          );
        }

        // Render the Tariff Calculator
        try {
          console.log('Attempting to render TariffCalculator');
          ReactDOM.render(
            React.createElement(TariffCalculator),
            document.getElementById('tariff-calculator-container')
          );
          console.log('TariffCalculator rendered successfully');
        } catch (renderError) {
          console.error('Error rendering TariffCalculator:', renderError);
          document.getElementById('tariff-calculator-container').innerHTML = 
            'Failed to render Tariff Calculator. Please check the console for more details.';
        }
      }).catch((error) => {
        console.error('Failed to load dependencies:', error);
        document.getElementById('tariff-calculator-container').innerHTML = 
          'Failed to load Tariff Calculator dependencies. Please check the console for more details.';
      });

      function loadScript(src) {
        return new Promise((resolve, reject) => {
          var script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    })();
  `;t.setHeader("Content-Type","application/javascript"),t.status(200).send(r)}let d=(0,l.l)(a,"default"),u=(0,l.l)(a,"config"),i=new n.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/embedded-calculator",pathname:"/api/embedded-calculator",bundlePath:"",filename:""},userland:a})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=4964);module.exports=r})();