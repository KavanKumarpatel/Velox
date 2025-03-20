import React from 'react'
import { Helmet } from 'react-helmet-async'
const Title = ({title = 'Velox Chat', description = 'My First MERN Project'}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
    </Helmet>
  )
}

export default Title