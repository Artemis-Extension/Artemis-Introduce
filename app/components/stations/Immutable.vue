<!-- 기획서 2장 원칙 1 · 5장 불변식 · 7장 모델 레지스트리 -->
<template>
  <section id="immutable" class="station" data-stamp="v2" data-band="light" style="--ground: var(--st-immutable)">
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">v2</span></p>
          <h2 class="h2">고치면 덮어쓰지 않고<br />새 버전이 생겨요</h2>
        </div>
        <p class="body" data-in>
          버전은 한 번 만들어지면 바뀌지 않아요. 고치는 일은 언제나 새 버전을 만드는 일이고, 운영 서비스는 버전 번호가 아니라 라벨을 따라가요.
          <strong>이 구조에서 움직이는 건 라벨 하나뿐이에요.</strong>
        </p>
      </div>

      <div class="versions">
        <div class="vstack" role="list" aria-label="버전과 라벨 (시연용 기록)">
          <div class="vrow" role="listitem" data-in>
            <span class="vrow__v inst">v3</span>
            <span class="vrow__msg">출력 형식을 표로 고정</span>
            <span class="vrow__labels"><i class="lbl">latest</i><i class="lbl">staging</i></span>
          </div>
          <div class="vrow" role="listitem" data-in>
            <span class="vrow__v inst">v2</span>
            <span class="vrow__msg">제약 입력 변수 추가</span>
            <span class="vrow__labels"><i class="lbl lbl--prod">production</i></span>
          </div>
          <div class="vrow vrow--old" role="listitem" data-in>
            <span class="vrow__v inst">v1</span>
            <span class="vrow__msg">첫 등록</span>
            <span class="vrow__labels" />
          </div>
          <p class="fine vstack__note">시연용 기록이에요. v3 이 production 이 되려면 라벨만 옮기면 되고, v1 · v2 는 그대로 남아요.</p>
        </div>

        <div class="guards" role="table" aria-label="버전을 고치려는 시도를 막는 곳">
          <div class="guards__row guards__head" role="row">
            <span role="columnheader">어디서</span>
            <span role="columnheader">무엇을 막나</span>
          </div>
          <div class="guards__row" role="row" data-in>
            <span class="guards__where" role="rowheader">모델 <code>save()</code> · <code>delete()</code></span>
            <span role="cell">이미 있는 버전을 고쳐 저장하거나 지우려 하면 거부해요.</span>
          </div>
          <div class="guards__row" role="row" data-in>
            <span class="guards__where" role="rowheader">DB 트리거 <code>0002_immutable_version</code></span>
            <span role="cell"><code>queryset.update()</code> 나 SQL <code>UPDATE</code> 로 모델을 건너뛰어 고쳐도 데이터베이스가 거부해요.</span>
          </div>
          <div class="guards__row" role="row" data-in>
            <span class="guards__where" role="rowheader">백오피스 본문 편집</span>
            <span role="cell">커밋 메시지가 없거나, 직전 버전과 내용 해시가 같으면 새 버전을 만들지 않아요.</span>
          </div>
          <div class="guards__row" role="row" data-in>
            <span class="guards__where" role="rowheader">데이터 콘솔</span>
            <span role="cell">버전을 추가 · 수정 · 삭제하는 권한이 아예 없어요.</span>
          </div>
        </div>
      </div>

      <div class="registry">
        <div class="registry__copy" data-in>
          <h3 class="h3">모델 파라미터도 레지스트리가 판단해요</h3>
          <p class="body">
            지금의 Claude 고성능 · 균형 모델은 <code>temperature</code> 를 받지 않아요. 보내면 400 이에요. 그래서 프롬프트는 모델 이름을 적지 않고 클래스에
            묶이고, 받을 수 있는 파라미터는 저장할 때와 실행할 때 레지스트리가 검사해요. 모델이 바뀌어도 프롬프트를 고치지 않아요.
          </p>
        </div>
        <div class="classes" role="table" aria-label="모델 클래스와 지금 해석되는 모델 (seed_models.py)">
          <div class="classes__row classes__head" role="row">
            <span role="columnheader">클래스</span>
            <span role="columnheader">지금 해석되는 모델</span>
            <span role="columnheader">temperature</span>
            <span role="columnheader">effort</span>
          </div>
          <div class="classes__row" role="row" data-in>
            <span role="rowheader">고성능 <code>high</code></span>
            <code role="cell">claude-opus-5</code>
            <span class="no" role="cell">받지 않음</span>
            <span class="inst" role="cell">low – max</span>
          </div>
          <div class="classes__row" role="row" data-in>
            <span role="rowheader">균형 <code>balanced</code></span>
            <code role="cell">claude-sonnet-5</code>
            <span class="no" role="cell">받지 않음</span>
            <span class="inst" role="cell">low – max</span>
          </div>
          <div class="classes__row" role="row" data-in>
            <span role="rowheader">경량 <code>light</code></span>
            <code role="cell">claude-haiku-4-5</code>
            <span role="cell">받음</span>
            <span class="no" role="cell">받지 않음</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
