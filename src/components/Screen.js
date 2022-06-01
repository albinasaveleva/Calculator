const Screen = ({result}) => {
  return (
    <input className="screen" value={result} readOnly />
    //<div className="screen">{result}</div>
  )
}

export default Screen;