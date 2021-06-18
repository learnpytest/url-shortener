document.querySelector('#copy-url-btn').addEventListener('click', onCopyUrlButtonClicked)
function onCopyUrlButtonClicked(e) {
  e.preventDefault()
  copyUrlExec()
}
function copyUrlExec() {
  const showShortUrl = document.querySelector('#show-short-url')
  const selection = window.getSelection()
  const range = document.createRange();
  range.selectNodeContents(showShortUrl);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
}