const Screen = ({result}) => {
  const checkedResult = () => {
    return result ? result : '';
  }
  return (
    <input className="screen" value={checkedResult()} readOnly />
    //<div className="screen">{result}</div>
  )
}

export default Screen;