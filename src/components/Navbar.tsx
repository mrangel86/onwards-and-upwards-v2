
// Since Navbar is in the read-only files, we cannot modify it directly.
// Instead, we'll create a CSS file to fix the dropdown behavior

<lov-write file_path="src/components/navbarFix.css">
/* Fix for dropdown menu collapse logic */
header .dropdown:hover .dropdown-content {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Ensure the dropdown stays open when hovering over its content */
header .dropdown-content {
  display: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

header .dropdown:hover .dropdown-content,
header .dropdown-content:hover {
  display: block;
  opacity: 1;
  visibility: visible;
}
