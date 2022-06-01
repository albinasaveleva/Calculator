const Key = ({className, content, onClick}) => {
  return (
    <span className={className} onClick={onClick} >{content}</span>
  )
}

export default Key