$services = @(
    "eureka-server",
    "api-gateway",
    "user-service",
    "product-catalog-service",
    "order-service",
    "shipping-service",
    "payment-service",
    "menu-service",
    "banner-service",
    "post-service",
    "product-recommendation-service"
)

$env:JAVA_HOME="C:\Program Files\Java\jdk-21"

foreach ($service in $services) {
    Write-Host "Starting $service..."
    $path = Join-Path "d:\e-commerce-microservices" $service
    # Use -WindowStyle Minimized to keep the UI clean if possible, but for background agents it might not matter
    Start-Process -FilePath "powershell" -ArgumentList "-Command `"cd $path; .\mvnw.cmd spring-boot:run`"" -WindowStyle Normal
    
    if ($service -eq "eureka-server") {
        Write-Host "Waiting for Eureka to start..."
        Start-Sleep -Seconds 20
    } elseif ($service -eq "api-gateway") {
        Write-Host "Waiting for Gateway to start..."
        Start-Sleep -Seconds 10
    } else {
        Start-Sleep -Seconds 5
    }
}

Write-Host "All startup commands sent."
