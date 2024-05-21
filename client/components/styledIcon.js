

import styled from 'styled-components'
import {HandThumbsDown, HandThumbsUp, HandThumbsDownFill, HandThumbsUpFill} from '@styled-icons/bootstrap'

export const ThumbUp = styled(HandThumbsUp)`
color: #fe019a;
font-weight: bold;
margin: 0.25rem;
&:hover {
  box-shadow: inset 0 0 10px #000000;
  curser: pointer;
}
  
`

export const ThumbDown = styled(HandThumbsDown)`
color: #fe019a;
font-weight: bold;
margin: 0.25rem;
&:hover {
  box-shadow: inset 0 0 10px #000000;
  curser: pointer;
}

`

export const ThumbUpSelected = styled(HandThumbsUpFill)`
color: #fe019a;
font-weight: bold;
margin: 0.25rem;
&:hover {
  box-shadow: inset 0 0 10px #000000;
  cursor: pointer;
}
box-shadow: 0 0 10px #fe019a;
`

export const ThumbDownSelected = styled(HandThumbsDownFill)`
color: #fe019a;
font-weight: bold;
margin: 0.25rem;
&:hover {
  box-shadow: inset 0 0 10px #000000;
  cursor: pointer;
}
box-shadow: 0 0 10px #fe019a;
`