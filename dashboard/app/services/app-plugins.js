import {install} from 'riot'
import path from 'path'

const classNames = (classes) => {
  return Object.entries(classes).reduce((acc, item) => {
    const [key, value] = item

    if (value) return [...acc, key]

      return acc
  }, []).join(' ')
}

const styleAttribute = (attributes) => {
  return Object.entries(attributes).reduce((acc, item) => {
    const [key, value] = item

    return [...acc, `${key}: ${value}`]
  }, []).join(';')
}
const showItem = (id,isShow)=>{
  let item = document.getElementById(id);
  if(isShow){
    item.classList.remove('hide')
  }else{
    item.classList.add('hide')
  }
}
const setHeaderTitle = (name) => {
    document.getElementById("header-title").innerHTML = name
}

const objectToQuerystring = (obj) => {
  return Object.keys(obj).reduce(function (str, key, i) {
    var delimiter, val;
    delimiter = (i === 0) ? '?' : '&';
    key = encodeURIComponent(key);
    val = encodeURIComponent(obj[key]);
    return [str, delimiter, key, '=', val].join('');
  }, '');
}

const setLink = (hash='', queryObj={}) => {
  const prefixPath = process.env.MIX_PREFIX_APP_PATH || '/'
  const p = path.join(prefixPath, '/#/', hash) + objectToQuerystring(queryObj)
  return p
}

const showingModal = (status) =>{
  let item = document.querySelector('body');
  if(status){
    item.classList.add('modal-open')
  }else{
    item.classList.remove('modal-open')
  }
}

install((component) => {
  component.classNames = classNames
  component.styleAttribute = styleAttribute
  component.setHeaderTitle = setHeaderTitle
  component.setLink = setLink
  component.showItem = showItem
  component.showingModal = showingModal

  return component
})