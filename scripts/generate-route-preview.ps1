Add-Type -AssemblyName System.Drawing

$templatePath = Join-Path (Get-Location) "public\share-templates\template_route_notebook.png"
$outPath = Join-Path (Get-Location) "public\generated-route-notebook-preview.png"

$template = [System.Drawing.Bitmap]::FromFile($templatePath)
$bmp = New-Object System.Drawing.Bitmap $template.Width, $template.Height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.DrawImage($template, 0, 0, $template.Width, $template.Height)

$fontFamily = New-Object System.Drawing.FontFamily "Microsoft YaHei"
$ink = [System.Drawing.ColorTranslator]::FromHtml("#143d35")
$muted = [System.Drawing.ColorTranslator]::FromHtml("#335b50")
$cream = [System.Drawing.ColorTranslator]::FromHtml("#fffdf6")
$paper = [System.Drawing.ColorTranslator]::FromHtml("#fbf3df")
$dark = [System.Drawing.ColorTranslator]::FromHtml("#0e3447")
$green = [System.Drawing.ColorTranslator]::FromHtml("#0a756b")
$orange = [System.Drawing.ColorTranslator]::FromHtml("#e45b2f")

function New-Brush($color) {
  return New-Object System.Drawing.SolidBrush $color
}

function Fill-Round($graphics, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r, $color) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  $brush = New-Brush $color
  $graphics.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

function Draw-FitText($graphics, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size, $color, [bool]$bold = $true, [bool]$center = $false) {
  $style = if ($bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
  $fontSize = $size
  do {
    $font = [System.Drawing.Font]::new($fontFamily, [single]$fontSize, $style, [System.Drawing.GraphicsUnit]::Pixel)
    $measure = $graphics.MeasureString($text, $font)
    if ($measure.Width -le $w -or $fontSize -le 10) { break }
    $font.Dispose()
    $fontSize -= 1
  } while ($true)

  while ($text.Length -gt 1 -and $graphics.MeasureString($text, $font).Width -gt $w) {
    $text = $text.Substring(0, $text.Length - 1)
  }

  $format = New-Object System.Drawing.StringFormat
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $format.Alignment = if ($center) { [System.Drawing.StringAlignment]::Center } else { [System.Drawing.StringAlignment]::Near }
  $brush = New-Brush $color
  $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
  $graphics.DrawString($text, $font, $brush, $rect, $format)
  $brush.Dispose()
  $font.Dispose()
  $format.Dispose()
}

function New-FakePhoto([string]$label, [string]$from, [string]$to) {
  $img = New-Object System.Drawing.Bitmap 640, 420
  $graphics = [System.Drawing.Graphics]::FromImage($img)
  $rect = New-Object System.Drawing.Rectangle 0, 0, 640, 420
  $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.ColorTranslator]::FromHtml($from)), ([System.Drawing.ColorTranslator]::FromHtml($to)), 35
  $graphics.FillRectangle($gradient, $rect)
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, 255, 255, 255)), 4
  for ($i = 0; $i -lt 8; $i++) {
    $graphics.DrawLine($pen, 0, 80 + $i * 38, 640, 50 + $i * 42)
  }
  $pen.Dispose()
  $gradient.Dispose()
  $graphics.Dispose()
  return $img
}

function Draw-Cover($graphics, $img, [float]$x, [float]$y, [float]$w, [float]$h) {
  $imageRatio = $img.Width / $img.Height
  $rectRatio = $w / $h
  $sx = 0
  $sy = 0
  $sw = $img.Width
  $sh = $img.Height
  if ($imageRatio -gt $rectRatio) {
    $sw = [int]($img.Height * $rectRatio)
    $sx = [int](($img.Width - $sw) / 2)
  } else {
    $sh = [int]($img.Width / $rectRatio)
    $sy = [int](($img.Height - $sh) / 2)
  }
  $dest = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
  $src = New-Object System.Drawing.Rectangle($sx, $sy, $sw, $sh)
  $graphics.DrawImage($img, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
}

$slots = @(
  @{ img = @(102, 407, 214, 210); title = @(127, 643, 188, 27); sub = @(74, 687, 248, 24); card = @(72, 360, 300, 335); rot = -2.58; patch = @(72, 345, 104, 42); place = "廊桥"; status = "散步"; note = "好看" },
  @{ img = @(654, 438, 192, 210); title = @(681, 675, 166, 27); sub = @(625, 716, 244, 24); card = @(610, 400, 270, 315); rot = 2.58; patch = @(710, 378, 110, 44); place = "教学楼"; status = "散步"; note = "美丽" },
  @{ img = @(83, 802, 220, 200); title = @(121, 1028, 174, 27); sub = @(68, 1073, 232, 24); card = @(70, 760, 290, 315); rot = 2.01; patch = @(48, 744, 112, 42); place = "庭院"; status = "回血中"; note = "可爱暴击" },
  @{ img = @(657, 862, 198, 198); title = @(686, 1091, 164, 27); sub = @(623, 1133, 248, 24); card = @(620, 820, 280, 315); rot = -2.01; patch = @(710, 797, 118, 42); place = "图书馆门口"; status = "猫猫"; note = "猫猫在伸懒腰" },
  @{ img = @(105, 1202, 190, 205); title = @(141, 1394, 168, 27); sub = @(88, 1437, 222, 24); card = @(90, 1160, 290, 300); rot = -2.01; patch = @(65, 1145, 110, 42); place = "宿舍楼下"; status = "晚风"; note = "落日无限好" },
  @{ img = @(672, 1238, 194, 188); title = @(699, 1441, 160, 27); sub = @(620, 1483, 246, 24); card = @(635, 1190, 275, 300); rot = 2.01; patch = @(735, 1170, 116, 42); place = "河边"; status = "回血中"; note = "风吹得刚刚好" }
)

$photos = @(
  (New-FakePhoto "廊桥" "#5b8cc0" "#f2c08a"),
  (New-FakePhoto "教学楼" "#70a77d" "#d7ecff"),
  (New-FakePhoto "庭院" "#34495e" "#f6b26b"),
  (New-FakePhoto "猫猫" "#8aa08d" "#f7f2e8"),
  (New-FakePhoto "晚风" "#2f4057" "#f6a35b"),
  (New-FakePhoto "河边" "#80c9f2" "#f7ccd4")
)

for ($i = 0; $i -lt $slots.Count; $i++) {
  $slot = $slots[$i]
  $card = $slot.card
  $centerX = $card[0] + $card[2] / 2
  $centerY = $card[1] + $card[3] / 2
  $state = $g.Save()
  $g.TranslateTransform($centerX, $centerY)
  $g.RotateTransform([float]$slot.rot)
  $g.TranslateTransform(-$centerX, -$centerY)
  $imageBox = $slot.img
  Fill-Round $g $imageBox[0] $imageBox[1] $imageBox[2] $imageBox[3] 8 ([System.Drawing.ColorTranslator]::FromHtml("#eef6ee"))
  Draw-Cover $g $photos[$i] $imageBox[0] $imageBox[1] $imageBox[2] $imageBox[3]
  $title = $slot.title
  $sub = $slot.sub
  Fill-Round $g ($title[0] - 5) ($title[1] - 4) ($title[2] + 10) ($title[3] + 8) 3 $cream
  Fill-Round $g ($sub[0] - 5) ($sub[1] - 4) ($sub[2] + 10) ($sub[3] + 8) 3 $cream
  Draw-FitText $g ($slot.place + " / " + $slot.status) $title[0] $title[1] $title[2] $title[3] 23 $ink $true $false
  Draw-FitText $g $slot.note $sub[0] $sub[1] $sub[2] $sub[3] 18 $muted $true $false
  $g.Restore($state)

  $patch = $slot.patch
  $src = New-Object System.Drawing.Rectangle($patch[0], $patch[1], $patch[2], $patch[3])
  $dst = New-Object System.Drawing.RectangleF($patch[0], $patch[1], $patch[2], $patch[3])
  $g.DrawImage($template, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
}

$route = @(
  @{ pill = @(448, 438, 88, 40); min = "+1min" },
  @{ pill = @(365, 594, 86, 40); min = "+1min" },
  @{ pill = @(469, 790, 86, 40); min = "+0min" },
  @{ pill = @(449, 976, 88, 40); min = "+1min" },
  @{ pill = @(481, 1174, 88, 40); min = "+0min" },
  @{ pill = @(480, 1344, 90, 40); min = "+1min" }
)

for ($i = 0; $i -lt $route.Count; $i++) {
  $item = $route[$i]
  $pill = $item.pill
  Fill-Round $g ($pill[0] - 3) ($pill[1] - 3) ($pill[2] + 6) ($pill[3] + 6) (($pill[3] + 6) / 2) $dark
  Draw-FitText $g $item.min ($pill[0] + 6) ($pill[1] + 6) ($pill[2] - 12) ($pill[3] - 8) 18 ([System.Drawing.Color]::White) $true $true
}

$tagSlots = @(
  @(214, 1597, 120, 38, "散步", "#dceee2", $green),
  @(380, 1597, 130, 38, "回血中", "#ffe3a2", $green),
  @(565, 1597, 140, 38, "校园Walk", "#ffd0cd", $orange)
)

foreach ($tag in $tagSlots) {
  $color = [System.Drawing.ColorTranslator]::FromHtml($tag[5])
  Fill-Round $g $tag[0] $tag[1] $tag[2] $tag[3] 19 $color
  Draw-FitText $g ("#" + $tag[4]) ($tag[0] + 8) ($tag[1] + 8) ($tag[2] - 16) ($tag[3] - 12) 18 $tag[6] $true $true
}

$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$photos | ForEach-Object { $_.Dispose() }
$g.Dispose()
$bmp.Dispose()
$template.Dispose()

Write-Output $outPath
