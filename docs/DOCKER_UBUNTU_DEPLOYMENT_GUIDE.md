# Ubuntu VPS deployment with Docker

This guide describes the production setup for `nyaysaathi.in`: Next.js frontend, Express/Prisma backend, PostgreSQL, host Nginx, Certbot TLS, and GitHub Actions deployment on pushes to `main`.

The database in this setup is new and empty. No data is migrated from the previous hosting environment.

## 1. Architecture and ports

- Nginx listens publicly on ports 80 and 443.
- Nginx proxies `/api/` to the backend on `127.0.0.1:5000` and other requests to Next.js on `127.0.0.1:3000`.
- Docker Compose runs the frontend, backend, and PostgreSQL.
- PostgreSQL is only reachable on the private Compose network. Its data is stored in the named `postgres_data` Docker volume.
- The frontend embeds `NEXT_PUBLIC_BACKEND_URL` during its Docker build. For this single-domain setup, use `https://nyaysaathi.in`; the browser then calls paths under `/api` on the same domain.
- GitHub Actions connects as the `deploy` Linux account, pulls `main`, rebuilds/restarts Compose, and checks the backend and frontend health endpoints.

## 2. DNS

In the domain DNS control panel, configure:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | The VPS public IPv4 address |
| CNAME | `www` | `nyaysaathi.in.` |

Keep the domain registrar's NS, SOA, domain connection, and mail records. Verify from the VPS:

```bash
apt update && apt install -y dnsutils
dig +short nyaysaathi.in A
dig +short www.nyaysaathi.in
```

Both names should resolve to the VPS IPv4 address before requesting a certificate. A timeout from a particular recursive DNS server can appear alongside a valid answer; confirm the final IP result.

## 3. Connect to Ubuntu from Windows

In Windows PowerShell, generate a personal SSH key:

```powershell
ssh-keygen -t ed25519 -C "raja-cloudonfire" -f "$env:USERPROFILE\.ssh\cloudonfire_root"
```

Add the contents of `cloudonfire_root.pub` to the VPS provider's SSH key panel. Keep `cloudonfire_root` private. From PowerShell connect with:

```powershell
ssh -i "$env:USERPROFILE\.ssh\cloudonfire_root" root@151.242.187.95
```

In Windows Command Prompt, use `%USERPROFILE%` instead of PowerShell's `$env:USERPROFILE` syntax:

```cmd
ssh -i "%USERPROFILE%\.ssh\cloudonfire_root" root@151.242.187.95
```

Replace the sample IP when the server changes. Confirm the SSH host fingerprint through the VPS console/provider before trusting a first connection.

## 4. Install Docker Engine and Compose

Run on Ubuntu. These commands install Docker's packages from its Ubuntu apt repository:

```bash
apt update
apt install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
docker run hello-world
docker compose version
```

## 5. Install Nginx, Certbot, Git, and configure the firewall

```bash
apt update
apt install -y git nginx certbot python3-certbot-nginx ufw
systemctl enable --now nginx

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status verbose
```

Also allow inbound TCP ports 22, 80, and 443 in the VPS provider firewall. Keep SSH allowed before enabling UFW. If SSH uses a nonstandard port, allow that port instead of relying only on the OpenSSH profile.

## 6. Clone the project and create server-only configuration

```bash
git clone --branch main https://github.com/Rahul2749/LawyerWebsite.git /opt/lawyerwebsite
cd /opt/lawyerwebsite
cp docker.env.example docker.env
chmod 600 docker.env
openssl rand -hex 32
openssl rand -hex 64
nano docker.env
```

Use the first random value for the PostgreSQL password and the second for `JWT_SECRET`. For the PostgreSQL password, replace the placeholder in both `POSTGRES_PASSWORD` and `DATABASE_URL` with the same value. The generated hex password is URL-safe.

Use the following production values in `docker.env`:

```dotenv
POSTGRES_DB=lawyerdb
POSTGRES_USER=lawyerapp
POSTGRES_PASSWORD=<first generated random value>
DATABASE_URL=postgresql://lawyerapp:<first generated random value>@db:5432/lawyerdb?schema=public
JWT_SECRET=<second generated random value>
FRONTEND_URL=https://nyaysaathi.in
NEXT_PUBLIC_BACKEND_URL=https://nyaysaathi.in
```

Do not commit `docker.env`, paste its contents into chat, or put secret values in the Dockerfile. `.gitignore` excludes it. `NEXT_PUBLIC_BACKEND_URL` is public and baked into the frontend at build time; rebuild the frontend after changing it.

### Environment variables

Backend requires:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection inside the Compose network; Compose constructs this from the database settings |
| `JWT_SECRET` | Secret for signing admin login tokens |

Backend server and CORS settings:

| Variable | Production value/default | Notes |
| --- | --- | --- |
| `NODE_ENV` | `production` | Set by Compose |
| `PORT` | `5000` | Set by Compose |
| `FRONTEND_URL` | `https://nyaysaathi.in` | Exact browser origin allowed by backend CORS |
| `JWT_EXPIRES_IN` | `7d` | Optional JWT lifetime |

Optional email/contact integration variables:

| Variable | Notes |
| --- | --- |
| `RESEND_API_KEY` | Without a key, email delivery is skipped; set a valid Resend key to enable it |
| `EMAIL_FROM_NAME` | Sender display name |
| `EMAIL_FROM_ADDRESS` | Must be accepted by the configured email provider |
| `LAWYER_PHONE` | Contact phone, digits including country code |
| `LAWYER_EMAIL` | Address for lawyer notifications |
| `LAWYER_WHATSAPP_NUMBER` | WhatsApp number, digits including country code and no `+` |

Optional payment integration variables:

| Variable | Notes |
| --- | --- |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Required to enable Razorpay checkout; use credentials from the intended live or test account |
| `PHONEPE_MERCHANT_ID`, `PHONEPE_SALT_KEY`, `PHONEPE_SALT_INDEX` | Required to enable PhonePe payments |
| `PHONEPE_BASE_URL` | Defaults to PhonePe's sandbox URL; change to the production URL when approved for live payments |
| `PHONEPE_REDIRECT_URL` | Set to the production confirmation page |
| `PHONEPE_CALLBACK_URL` | Set to the production API callback endpoint |

Email and Razorpay clients are safe to omit at startup. Their features will not work until configured. Never use sample credentials from old deployment notes.

## 7. Build and start the containers

Run as root initially:

```bash
cd /opt/lawyerwebsite
docker compose --env-file docker.env up -d --build
docker compose --env-file docker.env ps
docker compose --env-file docker.env logs --tail 80 backend
curl -i http://127.0.0.1:5000/api/health
curl -I http://127.0.0.1:3000
```

The backend container applies committed Prisma migrations before starting. On a new empty database, its startup process seeds initial services and the admin account. Confirm the API responds with HTTP 200 and the frontend responds with HTTP 200 before continuing.

The seed currently contains a source-controlled default admin password and the login API has no password-change endpoint. Replace that default securely before treating the admin area as production-ready; update the seed/reset approach rather than leaving the documented default in use. This deployment guide intentionally does not reproduce the password.

## 8. Configure host Nginx

```bash
cp /opt/lawyerwebsite/deploy/nginx/nyaysaathi.conf /etc/nginx/sites-available/nyaysaathi
ln -s /etc/nginx/sites-available/nyaysaathi /etc/nginx/sites-enabled/nyaysaathi
if [ -e /etc/nginx/sites-enabled/default ]; then unlink /etc/nginx/sites-enabled/default; fi
nginx -t && systemctl reload nginx
curl -I -H "Host: nyaysaathi.in" http://127.0.0.1
```

The final curl should return HTTP 200 through Nginx.

## 9. Enable HTTPS with Certbot

Once DNS resolves and Nginx serves the domain over HTTP:

```bash
certbot --nginx -d nyaysaathi.in -d www.nyaysaathi.in --redirect
certbot certificates
curl -I https://nyaysaathi.in
curl -I https://www.nyaysaathi.in
```

Enter an email address you can access when prompted. Confirm both HTTPS URLs return HTTP 200. Certbot installs a renewal timer; check and simulate renewal with:

```bash
systemctl status certbot.timer
certbot renew --dry-run
```

## 10. Set up GitHub Actions continuous deployment

The workflow is `.github/workflows/deploy.yml`. A push to `main` or a manual workflow dispatch connects to the VPS as `deploy`, fast-forwards the checkout, rebuilds Compose, then checks the API and frontend locally.

Create the Linux account and let it run Docker. Do this as root after the first deployment:

```bash
if ! id deploy >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash deploy
fi
usermod -aG docker deploy
chown -R deploy:deploy /opt/lawyerwebsite
chmod 600 /opt/lawyerwebsite/docker.env
install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
```

In Windows PowerShell, generate a separate automation key. Press Enter twice for an empty passphrase so the workflow can use it non-interactively:

```powershell
ssh-keygen -t ed25519 -C "github-actions-nyaysaathi" -f "$env:USERPROFILE\.ssh\github_actions_nyaysaathi"
scp "$env:USERPROFILE\.ssh\github_actions_nyaysaathi.pub" root@151.242.187.95:/tmp/github_actions_nyaysaathi.pub
```

On the VPS as root, install the public key for `deploy`:

```bash
install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
cat /tmp/github_actions_nyaysaathi.pub >> /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
for key in /etc/ssh/ssh_host_*_key.pub; do
  [ -f "$key" ] || continue
  printf '151.242.187.95 %s\n' "$(cat "$key")"
done
```

Copy the exact host key line(s) printed by the VPS. Prefer the `ssh-rsa` line; omit any `ssh-dss` line, which modern OpenSSH disables. Keep the IP and key data unchanged.

Test key authentication from Windows PowerShell:

```powershell
ssh -i "$env:USERPROFILE\.ssh\github_actions_nyaysaathi" deploy@151.242.187.95 "whoami && docker compose version"
```

It should print `deploy` and the Compose version without asking for the VPS password.

In the GitHub repository, open **Settings → Secrets and variables → Actions** and create these repository secrets:

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | VPS public IP, currently `151.242.187.95` |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_SSH_KEY` | Full contents of the private `github_actions_nyaysaathi` key; never share it in chat or commit it |
| `DEPLOY_KNOWN_HOSTS` | Exact host key line(s) generated on the VPS |

To copy the private key to the Windows clipboard for direct pasting into GitHub's secret form:

```powershell
Get-Content -Raw "$env:USERPROFILE\.ssh\github_actions_nyaysaathi" | Set-Clipboard
```

After all four secrets exist, commit and push the workflow:

```powershell
cd C:\Github\LawyerWebsite
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

Follow the run under the repository's **Actions** tab. A successful run ends with `Deployment is healthy.` For manual deployment from the VPS, use:

```bash
cd /opt/lawyerwebsite
git pull --ff-only origin main
docker compose --env-file docker.env up -d --build --remove-orphans
```

## 11. Routine operations and backups

Check services and recent logs:

```bash
cd /opt/lawyerwebsite
docker compose --env-file docker.env ps
docker compose --env-file docker.env logs --tail 100 backend
docker compose --env-file docker.env logs --tail 100 frontend
docker compose --env-file docker.env logs --tail 100 db
```

Restart services after editing `docker.env`:

```bash
docker compose --env-file docker.env up -d --build
```

Changing `NEXT_PUBLIC_BACKEND_URL` requires a frontend rebuild because it is embedded into the client bundle. The Compose command above rebuilds all images.

Create a SQL backup of the new database (adjust the database/user names if changed):

```bash
cd /opt/lawyerwebsite
docker compose --env-file docker.env exec -T db pg_dump -U lawyerapp lawyerdb > "/root/lawyerdb-$(date +%F).sql"
```

Store backups somewhere off the VPS as well. A Docker volume protects data across container rebuilds, but it is not a backup. Restore to this database with:

```bash
cat /root/lawyerdb-YYYY-MM-DD.sql | docker compose --env-file docker.env exec -T db psql -U lawyerapp -d lawyerdb
```

Do not run `docker compose down -v` unless you intend to delete the PostgreSQL volume and all data in it.

## 12. Troubleshooting

- **Backend restarts:** inspect `docker compose --env-file docker.env logs --tail 100 backend`; confirm database health and `JWT_SECRET`/`DATABASE_URL` are configured.
- **Frontend loads but API calls fail:** verify `NEXT_PUBLIC_BACKEND_URL=https://nyaysaathi.in`, rebuild frontend, and confirm `FRONTEND_URL=https://nyaysaathi.in` in backend settings.
- **Certbot cannot validate the domain:** verify both DNS records, provider firewall TCP 80/443, UFW, and Nginx HTTP routing.
- **Actions reports host-key failure:** replace `DEPLOY_KNOWN_HOSTS` with the exact current public host key output from the VPS. Do not use redacted key text or DSA (`ssh-dss`).
- **Actions reports permission denied:** verify the public key is in `/home/deploy/.ssh/authorized_keys`, its ownership/mode, and the `deploy` account's Docker group membership.
- **Actions reports `git pull` failure:** ensure `/opt/lawyerwebsite` is owned by `deploy` and the remote branch is `main`.
- **DNS resolver timeout but the domain IP prints:** the requested resolver may be unreachable from the VPS; the final A/CNAME answer is what to compare with the VPS IP.

## 13. Security notes

- Keep `docker.env`, database backups, and private SSH keys out of Git and chat. The deployment user needs access to `docker.env`; it is mode 600 and owned by that user.
- The Docker group can control the Docker daemon and is effectively root-level access. Use the `deploy` account only for trusted automation.
- Rotate any real credentials that appeared in old committed deployment documentation. Deleting that file from the current branch does not erase earlier Git history.
- Configure production payment credentials and verify the payment provider's live account and callback settings before accepting real payments.
