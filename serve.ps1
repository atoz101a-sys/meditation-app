$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$url = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
  $listener.Start()
} catch {
  Write-Host "서버 시작 실패. 관리자 권한이 필요할 수 있습니다."
  Read-Host "Enter 키를 누르면 종료"
  exit 1
}

Write-Host "명상 앱 서버 실행 중: $url"
Write-Host "종료하려면 이 창을 닫으세요."
Start-Process "$url/index.html"

function Get-MimeType($path) {
  switch ([IO.Path]::GetExtension($path).ToLower()) {
    '.html' { return 'text/html; charset=utf-8' }
    '.css'  { return 'text/css; charset=utf-8' }
    '.js'   { return 'application/javascript; charset=utf-8' }
    '.jpg'  { return 'image/jpeg' }
    '.jpeg' { return 'image/jpeg' }
    '.png'  { return 'image/png' }
    '.mp4'  { return 'video/mp4' }
    default { return 'application/octet-stream' }
  }
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response

  try {
    $localPath = [Uri]::UnescapeDataString($request.Url.LocalPath)
    if ($localPath -eq '/') { $localPath = '/index.html' }
    $relativePath = $localPath.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
    $filePath = Join-Path $root $relativePath

    if (Test-Path $filePath -PathType Leaf) {
      $bytes = [IO.File]::ReadAllBytes($filePath)
      $response.StatusCode = 200
      $response.ContentType = Get-MimeType $filePath
      $response.Headers.Add('Referrer-Policy', 'strict-origin-when-cross-origin')
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $msg = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $response.StatusCode = 500
  } finally {
    $response.OutputStream.Close()
    $response.Close()
  }
}
