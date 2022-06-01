const Screen = ({result}) => {
  return (
    <input className="screen" value={result} readOnly />
    // <div className="screen">{screen}</div>
  )
}

export default Screen;