#!/bin/bash

echo "🔧 Fixing EMFILE error for macOS..."
echo ""

# Increase file limit
ulimit -n 65536

# Check current limit
echo "✓ File descriptor limit increased to: $(ulimit -n)"
echo ""

# Add to shell profile for permanent fix
SHELL_RC=""
if [ -f ~/.zshrc ]; then
    SHELL_RC=~/.zshrc
elif [ -f ~/.bashrc ]; then
    SHELL_RC=~/.bashrc
fi

if [ -n "$SHELL_RC" ]; then
    if ! grep -q "ulimit -n 65536" "$SHELL_RC"; then
        echo "" >> "$SHELL_RC"
        echo "# Fix EMFILE error for Expo/Metro bundler" >> "$SHELL_RC"
        echo "ulimit -n 65536" >> "$SHELL_RC"
        echo "✓ Added permanent fix to $SHELL_RC"
    else
        echo "✓ Permanent fix already in $SHELL_RC"
    fi
fi

echo ""
echo "Now run: cd mobile && npm start"

