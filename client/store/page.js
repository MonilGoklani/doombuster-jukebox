const SET_PAGE = 'SET_PAGE'

export const _page = (page) => {
  return {
    type: SET_PAGE,
    page
  }
};

export const page = ()=>{
  return async (dispatch)=>{
    const page = window.location.pathname.slice(1,-2)
    dispatch(_page(page))
  }
}

export default function(state = '', action) {
  switch (action.type) {
    case SET_PAGE:
      return action.page
    default:
      return state
  }
}
