## Info
GitHub Actions plugin to cancel previous pull_request checks. Helps to save money on GitHub Actions runs.

## Usage
```yaml
name: Pull Request Cancel Example
on: [pull_request]

jobs:
  check-job:
    runs-on: ubuntu-latest
    steps:
      - run: sleep 10
      - run: sleep 10
      - run: sleep 10
      
      - uses: tutu-ru-mobile/cancel-previous-pull-request@master
        with:
          access_token: "${{ secrets.GITHUB_TOKEN }}"
          
      - run: sleep 10
      - run: sleep 10
      - run: sleep 10
        
```

## Contributing
- Run `yarn install`
- Edit `./src/index.ts`
- Run `yarn build`
- Commit changes including `./dist/index.js` bundle
