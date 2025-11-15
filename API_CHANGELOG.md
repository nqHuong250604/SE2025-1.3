# API Change Log

## [2025-11-15] — Initial API Contract Verified
- Verified product list structure from Swagger
- Confirmed transactions endpoints available:
  - POST /transactions/import
  - POST /transactions/export

## [2025-11-15] — Response Format Confirmed
- product model includes: id, name, sku, description, quantity
- transaction model includes: id, product_id, quantity, type

## Notes
- Any backend change MUST be reported to frontend team.
- Always update this document if new fields are added or removed.
