# Git Workflow for API Integration (Hồ Thái Đức)

## Branch naming
feature/api-integration  
fix/api-response  
hotfix/urgent-api-issue  

## Workflow

1. Checkout new feature branch:
   git checkout -b feature/api-integration

2. Make updates:
   - Add error handling
   - Update API integration
   - Adjust axios logic if backend changes

3. Commit:
   git add .
   git commit -m "feat: improve API integration and error handling"

4. Push:
   git push origin feature/api-integration

5. Create Pull Request on GitHub

## Rules
- NEVER push directly to main
- Every backend API change must be tested on Swagger before merging
- Every API update must be recorded in API_CHANGELOG.md
