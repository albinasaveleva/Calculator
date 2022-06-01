const Screen = ({result}) => {
  return (
    <div className="screen-wrapper">
      <div className="screen">{result}</div>
    </div>
  )
}
//<input className="screen" value={result} readOnly />

export default Screen;