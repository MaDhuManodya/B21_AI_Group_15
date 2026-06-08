# ============================================================
# OWNER: Malinda
# MODULE: Category Update form (/ui/categories/edit/{id})
# SRS REFERENCE: §5.2 — Add / Edit Category Page
# COVERAGE NOTES:
#   - Category Name (required, 3-10 chars)
#   - Parent Category (optional — empty = main category)
#   - Success message "Category updated successfully"
#   - Cancel returns to /ui/categories
#   - User -> 403 if accessing /ui/categories/edit/{id}
# TAGS: @malinda @categories @ui  + @admin|@user + @smoke/@negative/@rbac
# REUSE: CategoryFormPage.ts (edit half — TODO Malinda).
# ============================================================
@malinda @categories @ui
Feature: Category Update

  # TODO Malinda: implement Edit Category scenarios here.
  # Suggested IDs: UI_CATEGORY_ADMIN_001 (update success), UI_CATEGORY_ADMIN_002 (name length 3-10),
  #                UI_CATEGORY_USER_001 (403 on /ui/categories/edit/{id}).
