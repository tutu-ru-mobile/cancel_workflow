## Usage
```yaml
name: Pull Request Cancel Example
on: [pull_request]

jobs:
  check-job:
    runs-on: ubuntu-latest
    steps:
      - run: echo 'Running now'
      - run: sleep 10
      - run: sleep 10
      - run: sleep 10
      - uses: tutu-ru-mobile/cancel-workflow-action@master
        with:
          access_token: "${{ secrets.GITHUB_TOKEN }}"
      - run: sleep 10
      - run: sleep 10
      - run: sleep 10
      - run: echo 'wasnt cancelled'
        
```

## Contributing
- Run `yarn install`
- Edit `./src/index.ts`
- Run `yarn build`
- Commit changes including `./dist/index.js` bundle
