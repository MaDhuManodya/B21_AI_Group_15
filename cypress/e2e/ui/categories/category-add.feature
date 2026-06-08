# ============================================================
# OWNER: Manodya
# MODULE: Add Category form (/ui/categories/add)
# SRS REFERENCE: §5.2 — Add / Edit Category Page
# COVERAGE NOTES:
#   - Category Name (required, 3-10 chars)
#   - Parent Category (optional — empty = main category)
#   - Save / Cancel buttons
#   - Validation errors below field
#   - User -> 403 if accessing /ui/categories/add
# TAGS: @manodya @categories @ui  + @admin|@user + @smoke/@negative/@rbac
# REUSE: CategoryFormPage.ts (add half — TODO Manodya).
# ============================================================
@manodya @categories @ui
Feature: Add Category

  # TODO Manodya: implement Add Category scenarios.
  # Suggested IDs: UI_CATEGORY_ADMIN_006 (add success), UI_CATEGORY_ADMIN_007 (name validation 3-10),
  #                UI_CATEGORY_USER_004 (403 on /ui/categories/add).
