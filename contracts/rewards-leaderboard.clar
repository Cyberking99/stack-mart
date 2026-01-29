;; Rewards and Leaderboard Contract
;; This contract tracks user points based on Stacks activity, 
;; library usage, and GitHub contributions.

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-USER-NOT-FOUND (err u101))
(define-constant ERR-BUFFER-OVERFLOW (err u102))
(define-constant ERR-INVALID-POINTS (err u103))
(define-constant ERR-COOLDOWN-ACTIVE (err u104))

;; Constants
(define-constant ADMIN tx-sender)
(define-constant POINTS-PER-CONTRACT-ACTIVITY u50)
(define-constant POINTS-PER-LIBRARY-USAGE u25)
(define-constant DECAY-FACTOR u95) ;; 5% decay periodically

;; Data Maps
(define-map UserPoints
    principal
    {
        total-points: uint,
        contract-impact-points: uint,
        library-usage-points: uint,
        github-contrib-points: uint,
        last-activity-block: uint,
        reputation-score: uint
    }
)

(define-map GlobalStats
    uint ;; Index 0
    {
        total-users: uint,
        total-points-distributed: uint,
        top-score: uint
    }
)

;; Read-only: Get User Stats
(define-read-only (get-user-stats (user principal))
    (map-get? UserPoints user)
)

;; Read-only: Get Global Stats
(define-read-only (get-global-stats)
    (default-to 
        { total-users: u0, total-points-distributed: u0, top-score: u0 }
        (map-get? GlobalStats u0)
    )
)

;; Private Initialize User
(define-private (initialize-user (user principal))
    (map-set UserPoints user
        {
            total-points: u0,
            contract-impact-points: u0,
            library-usage-points: u0,
            github-contrib-points: u0,
            last-activity-block: block-height,
            reputation-score: u0
        }
    )
)
