console.log("Email Writer Extension - Content Script Loaded!")

function findComposeToolBar(){
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for(const selector of selectors){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }

       
    }
     return null;

}

function getEmailContent(){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role=presentation]'
    ];
    for(const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }

       
    }
     return '';

}

function createAIButton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML='AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;
   
     

}


function createToneDropdown() {
    const select = document.createElement('select');

    select.className = 'ai-tone-select';
    select.style.marginRight = '8px';
    select.style.height = '30px';
    select.style.borderRadius = '4px';
    select.style.border = '1px solid #ccc';
    select.style.padding = '2px 6px';
    select.style.cursor = 'pointer';

    const tones = [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'formal', label: 'Formal' },
        { value: 'concise', label: 'Concise' }
    ];

    tones.forEach(tone => {
        const option = document.createElement('option');
        option.value = tone.value;
        option.textContent = tone.label;
        select.appendChild(option);
    });

    return select;
}

function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton) existingButton.remove();

    const toolbar = findComposeToolBar();

    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found, creating AI button");
    const button = createAIButton();

    const toneDropdown = createToneDropdown();

    button.classList.add('.ai-reply-button');

    button.addEventListener('click',async () => {
         try{
            button.innerHTML='Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
        const response =  await fetch('http://localhost:8080/api/email/generate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    
                        emailContent: emailContent,
                        tone: toneDropdown.value
                    
                })
            });
            if(!response.ok){
                throw new Error('API Request Failed');
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if(composeBox){ 
                composeBox.focus();
                document.execCommand('insertText',false,generatedReply);
            }else{
                console.error('Compose Box was not found');
            }


         }catch(error){
            console.error(error)
           alert('failed to generate reply');
         }finally{
            button.innerHTML = 'AI Reply';
            button.disabled = false;
         }

    });

    toolbar.insertBefore(toneDropdown, toolbar.firstChild);
    toolbar.insertBefore(button, toneDropdown.nextSibling);


}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations){
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements =  addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]') )
        );
        if(hasComposeElements){
            console.log("Compose Window Dectected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body,{
    childList:true,
    subtree: true
});