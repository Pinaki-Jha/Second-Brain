


export const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
 

export const Heading1Element = props => {

  return (
    <>
    <h1 className="text-4xl underline font-bold" {...props.attributes}>
      {props.children}
    </h1>
    </>
  )
}

export const Heading2Element = props => {

  return (
    <>
    <h1 className=" text-3xl underline font-bold" {...props.attributes}>
      {props.children}
    </h1>
    </>
  )
}

export const Heading3Element = props => {

  return (
    <>
    <h1 className=" text-2xl underline font-bold" {...props.attributes}>
      {props.children}
    </h1>
    </>
  )
}

export const Heading4Element = props => {

  return (
    <>
    <h1 className=" text-xl underline font-bold" {...props.attributes}>
      {props.children}
    </h1>
    </>
  )
}

export const Heading5Element = props => {

  return (
    <>
    <h1 className=" text-lg underline font-bold" {...props.attributes}>
      {props.children}
    </h1>
    </>
  )
}


export const Heading6Element = props => {

  return (
    <>
    <h1 className=" text-base underline font-bold" {...props.attributes}>
      {props.children}
    </h1>
    </>
  )
}



export const DefaultElement = props =>{

  return(
    <p {...props.attributes}>{props.children}</p>
  )
}


