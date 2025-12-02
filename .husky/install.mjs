// Husky install script
import { fileURLToPath } from 'node:url'
import { writeFileSync, mkdirSync, chmodSync } from 'node:fs'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const huskyDir = join(__dirname, '..', '.husky')

// Create .husky directory if it doesn't exist
mkdirSync(huskyDir, { recursive: true })

// Create _ directory for husky.sh
const huskyInternalDir = join(huskyDir, '_')
mkdirSync(huskyInternalDir, { recursive: true })

// Create husky.sh helper
writeFileSync(
  join(huskyInternalDir, 'husky.sh'),
  `#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exitcode="$?"

  if [ $exitcode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitcode (error)"
  fi

  if [ $exitcode = 127 ]; then
    echo "husky - command not found in PATH=$PATH"
  fi

  exit $exitcode
fi
`,
  { mode: 0o755 }
)

// Create pre-commit hook
writeFileSync(
  join(huskyDir, 'pre-commit'),
  `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged to check and fix staged files
npx lint-staged

echo "✅ Pre-commit checks passed!"
`,
  { mode: 0o755 }
)

// Create pre-push hook
writeFileSync(
  join(huskyDir, 'pre-push'),
  `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Type check
echo "🔍 Running TypeScript type check..."
npm run typecheck

# Run tests (optional - uncomment if you want tests to run before push)
# echo "🧪 Running tests..."
# npm test

echo "✅ Pre-push checks passed!"
`,
  { mode: 0o755 }
)

console.log('✅ Husky hooks installed!')
