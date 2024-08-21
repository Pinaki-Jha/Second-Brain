// Import React dependencies.
import React, { useState } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'


const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
  
  const TextEditor = () => {
    const [editor] = useState(() => withReact(createEditor()))
    return (
      // Add the editable component inside the context.
      <div>
      <Slate editor={editor} initialValue={initialValue} >
        <Editable className='focus:outline-none'/>
      </Slate>
      </div>
    )
  }


export default TextEditor