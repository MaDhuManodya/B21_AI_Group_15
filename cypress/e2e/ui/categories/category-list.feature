# ============================================================
# OWNER: Manodya
# MODULE: Category list page (/ui/categories)
# SRS REFERENCE: §5.1 — Category List Page
# COVERAGE NOTES:
#   - Paginated list of categories (ID, Name, Parent)
#   - Search by category name
#   - Filter by parent category (All Parents dropdown)
#   - Sort by ID / Name / Parent
#   - Empty state: "No category found"
#   - Admin: "Add Category" button visible
#   - User: "Add Category" hidden / disabled
# TAGS: @manodya @categories @ui  + @admin|@user + @smoke/@negative/@rbac
# REUSE: CategoryListPage.ts (TODO Manodya — fill selectors + methods).
# ============================================================
@manodya @categories @ui
Feature: Category List

  # TODO Manodya: implement category list scenarios.
  # Suggested IDs: UI_CATEGORY_ADMIN_003 (view paginated list), UI_CATEGORY_ADMIN_004 (search by name),
  #                UI_CATEGORY_ADMIN_005 (filter by parent), UI_CATEGORY_USER_002 (no Add button),
  #                UI_CATEGORY_USER_003 (sort works).
