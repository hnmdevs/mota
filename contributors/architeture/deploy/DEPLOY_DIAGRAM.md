# Deploy Flow Diagram - Mota Framework

```mermaid
graph TD
    A[Developer pushes tag v*] --> B[deploy.yml]
    
    B --> C{Build & Publish Pre-release}
    C -->|Success| D[Trigger e2e-tests.yml]
    C -->|Failure| X[❌ Deploy Failed]
    
    D --> E{Run E2E Tests}
    E -->|✅ Pass| F[Trigger finalize-release.yml]
    E -->|❌ Fail| G[Trigger rollback-release.yml]
    
    F --> H[Promote to Latest Tag]
    H --> I[Generate Changelog]
    I --> J[Create GitHub Release]
    J --> K[✅ Deploy Complete]
    
    G --> L[Remove Pre-release Packages]
    L --> M[Delete Git Tag]
    M --> N[Create Failure Issue]
    N --> O[❌ Deploy Rolled Back]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#f3e5f5
    style F fill:#f3e5f5
    style G fill:#f3e5f5
    style K fill:#e8f5e8
    style O fill:#ffebee
    style X fill:#ffebee
```

## Detailed Flow by Workflow

### 1. Deploy Release (deploy.yml)
```mermaid
graph LR
    A[Tag Push] --> B[Extract Version]
    B --> C[Setup Environment]
    C --> D[Build Packages]
    D --> E[Publish Pre-release]
    E --> F[Trigger E2E Tests]
```

### 2. E2E Tests (e2e-tests.yml)
```mermaid
graph LR
    A[Triggered by Deploy] --> B[Install Pre-release]
    B --> C[Run Playwright Tests]
    C --> D{Tests Result}
    D -->|Pass| E[Trigger Finalize]
    D -->|Fail| F[Trigger Rollback]
    C --> G[Upload Artifacts]
```

### 3A. Finalize Release (finalize-release.yml)
```mermaid
graph LR
    A[E2E Tests Passed] --> B[Promote to Latest]
    B --> C[Remove Pre-release Tags]
    C --> D[Generate Changelog]
    D --> E[Create GitHub Release]
    E --> F[Commit Version Changes]
```

### 3B. Rollback Release (rollback-release.yml)
```mermaid
graph LR
    A[E2E Tests Failed] --> B[Unpublish Packages]
    B --> C[Remove NPM Tags]
    C --> D[Delete Git Tag]
    D --> E[Download Test Artifacts]
    E --> F[Create Failure Issue]
```

## NPM Package States

```mermaid
stateDiagram-v2
    [*] --> Development
    Development --> PreRelease: git tag v*
    PreRelease --> Latest: E2E Tests Pass
    PreRelease --> Removed: E2E Tests Fail
    Latest --> [*]: Stable Release
    Removed --> [*]: Rollback Complete
    
    note right of PreRelease
        Packages tagged as
        "pre-release" on NPM
    end note
    
    note right of Latest
        Packages promoted to
        "latest" tag on NPM
    end note
```

## Typical Timeline

```mermaid
gantt
    title Deploy Timeline
    dateFormat X
    axisFormat %M:%S
    
    section Deploy
    Build & Publish Pre-release    :deploy, 0, 3
    
    section Testing
    E2E Tests Execution           :test, after deploy, 15
    
    section Success Path
    Promote to Latest             :promote, after test, 2
    Generate Changelog            :changelog, after promote, 1
    Create GitHub Release         :release, after changelog, 1
    
    section Failure Path
    Rollback Process              :crit, rollback, after test, 3
```

## Decision Points

```mermaid
flowchart TD
    A[Start Deploy] --> B{Build Success?}
    B -->|No| C[❌ Stop - Build Failed]
    B -->|Yes| D[Publish Pre-release]
    
    D --> E{E2E Tests Pass?}
    E -->|No| F[🔄 Rollback]
    E -->|Yes| G[📦 Finalize Release]
    
    F --> H[Remove Packages]
    F --> I[Create Issue]
    F --> J[❌ Deploy Failed]
    
    G --> K[Promote to Latest]
    G --> L[Create Release]
    G --> M[✅ Deploy Success]
```

## Legend

- 🟢 **Success**: Process completed successfully
- 🔴 **Failure**: Process failed, rollback required  
- 🟡 **In Progress**: Process executing
- 🔄 **Rollback**: Reverting changes
- 📦 **NPM**: Package operations
- 🏷️ **Git**: Tag/release operations
- 🧪 **Test**: Test execution 