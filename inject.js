(function() {
  const firstScript = document.querySelector('script')
  
  // inject scripts into webpage
  const filenames = ['script.js','lib/beautify_html.min.js', 'lib/beautify_js.min.js']
  filenames.forEach(filename => {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL(filename)
    firstScript.parentElement.insertBefore(script, firstScript)
  })
})()