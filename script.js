
(function() {
  window.addEventListener('load', runProgram)

  async function runProgram() {

    let programType;

    if(matchParams('/computer-programming/new/pjs')) {
      programType = 'pjs'
    }
    else if(matchParams('/computer-programming/new/webpage')) {
      programType = 'webpage'
    }
    else {
      const params = matchParams('/computer-programming/:name/:programId')
      if(!params) return
  
      const { programId } = params
  
      // fetch program data from api
      const programData = (
        await fetch(`https://www.khanacademy.org/api/internal/scratchpads/${programId}`)
                .then(res => res.json())
      )

      if(!programData) {
        return console.log("Unable to fetch program data. Exiting")
      }

      programType = programData.userAuthoredContentType
    }
   
    const ace = window.ace
    
    const editorElem = await retry(() => document.querySelector('.scratchpad-ace-editor'))
    if(!editorElem) return

    const formatBtn = await insertFormatButton()
    if(!formatBtn) return

    formatBtn.onclick = () => {
      formatCode(editorElem, programType)
    }
  }

  function retry(cb, maxTries = 100, rate = 100) {
    let tries = 0
    return new Promise(resolve => {
      const interval = setInterval(() => {
        let result = cb()
        if(result || tries >= maxTries) {
          resolve(result)
          clearInterval(interval)
        }
        tries++
      }, rate)
    })
  }
  
  function formatCode(aceElem, codeType) {
    const aceEditor = ace.edit(aceElem)
    const formatOptions = {
      indent_size: aceEditor.session.getOption('tabSize') || 2
    }
    const currentCode = aceEditor.session.getValue()
    const formattedCode = (
      codeType === 'pjs' ? window.js_beautify(currentCode, formatOptions) : 
      codeType === 'webpage' ? window.html_beautify(currentCode, formatOptions) :
      currentCode
    )
    aceEditor.session.setValue(formattedCode)
  }

  async function insertFormatButton() {
    const errorBuddyElem = await retry(() => document.querySelector('.error-buddy-resting'))
    if(!errorBuddyElem) return null
    const btn = document.createElement('button')
    btn.classList.add('cfe-format-btn')
    btn.innerHTML = 'Format Code'
    errorBuddyElem.parentNode.parentNode.insertBefore(btn, errorBuddyElem.parentNode)
    return btn
  }

  function matchParams(params) {
    const { pathname } = window.location
    const names = (params.match(/\/:\w+/ig) || []).map(n => n.slice(2))
    const urlRegex = params.replace(/:\w+/g, '([\\w\\-]+)')
    const regex = new RegExp(`^${urlRegex}$`)
    if(!regex.test(pathname)) {
      return null
    }
    const values = pathname.match(regex).slice(1, names.length + 1)
    let obj = {}
    for(var i = 0; i < names.length; i++) {
      obj[names[i]] = values[i]
    }
    return obj
  }
})()